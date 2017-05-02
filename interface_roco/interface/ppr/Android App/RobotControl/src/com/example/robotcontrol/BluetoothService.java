package com.example.robotcontrol;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream; 
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap; 
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Semaphore;

import android.annotation.SuppressLint;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.ParcelUuid;
import android.os.Parcelable;
import android.util.Log;


@SuppressLint("NewApi") 
public class BluetoothService extends Service// implements BluetoothAdapter.LeScanCallback
{
	public static final String BT_NEW_DEVICE = "com.example.rfduino.BT_NEW_DEVICE";
	public static final String BT_DEVICE_STRING = "com.example.rfduino.BT_DEVICE_STRING";
	public static final String BT_ENABLE = "com.example.rfduino.BT_ENABLE"; 
	public static final String BT_SCAN = "com.example.rfduino.BT_SCAN";
	public static final String BT_CONNECT = "com.example.rfduino.BT_CONNECT";
	public static final String BT_DATA = "com.example.rfduino.BT_DATA";
	
	private final int API = android.os.Build.VERSION.SDK_INT;
    private final boolean BLE = (API >= 18);
    
    private final long BLE_SCAN_PERIOD = 4000;
    private final int MAX_BTDATA_LENGTH = 100; // TODO deal with case when this is exceeded
    private boolean heartbeatEnabled = true;
    private final long HEARTBEAT_TIMEOUT = 90000;
    private final byte[] heartbeatString = new byte[] {(byte)'?', (byte)'\0'}; 
    
	// Binder given to clients
    private final IBinder binder = new LocalBinder();
    private Handler mHandler;
    
    private BluetoothAdapter bluetoothAdapter = null;
    // Record available devices
    private HashMap<String, BluetoothDevice> btDevices = null;
    private HashMap<String, Boolean> btDeviceBLE = null;
    private Semaphore btDevicesMutex = null;
    private boolean scanningLE = false;
    private boolean scanningClassic = false;
    // Record connected devices
    private HashMap<String, BluetoothGatt> btGatts = null;
    private HashMap<String, BluetoothSocket> btSockets = null;
    private HashMap<String, byte[]> btData = null;
    private HashMap<String, Semaphore> btDeviceMutexes = null;
    private HashMap<String, Long> heartbeatTimes = null;
    
    private final BluetoothHelper helper = new BluetoothHelper();
    public final UUID UUID_SERVICE = helper.sixteenBitUuid(0x2220);
    public final UUID UUID_SEND = helper.sixteenBitUuid(0x2222);
    public final UUID UUID_RECEIVE = helper.sixteenBitUuid(0x2221);
    public final UUID UUID_CLIENT_CONFIGURATION = helper.sixteenBitUuid(0x2902);
    
    // Receiver for enabling bluetooth
    private BroadcastReceiver receiverAdapterState = new BroadcastReceiver() {
		@Override
		public void onReceive(Context arg0, Intent arg1) 
		{
			String action = arg1.getAction();
			// Check that we got correct broadcast
			if(BluetoothAdapter.ACTION_STATE_CHANGED.equals(action))
			{
				switch(arg1.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1))
				{
					case BluetoothAdapter.STATE_OFF:
			        	sendBroadcast(new Intent(BT_ENABLE).putExtra(BT_ENABLE, false));
						break;
					case BluetoothAdapter.STATE_ON:
						sendBroadcast(new Intent(BT_ENABLE).putExtra(BT_ENABLE, true));
						break;
					case BluetoothAdapter.STATE_TURNING_OFF:
						break;
					case BluetoothAdapter.STATE_TURNING_ON:
						break;
				}
			}		
		}
	};
	
	// Implements callback methods for GATT events that the app cares about.  For example,
    // connection change and services discovered.
	private Object gattCallback = null; // Use Object so can work with non-BLE devices
	private BluetoothGattCallback getGattCallback()
	{
		if(gattCallback == null) // Only define the callback once
		{
			gattCallback = new BluetoothGattCallback() 
		    {
		        @Override
		        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) 
		        {
		        	String deviceString = getDeviceString(gatt.getDevice());
		        	try {btDeviceMutexes.get(deviceString).acquire();} catch (InterruptedException e) {}
		            if(newState == BluetoothProfile.STATE_CONNECTED) 
		            {
		            	if(btGatts.containsKey(deviceString))
		            	{
		            		btDeviceMutexes.get(deviceString).release();
		            		return;
		            	}
		                log("Connected to " + deviceString);
		                log("Attempting to start service discovery:" + gatt.discoverServices());
		            } 
		            else if(newState == BluetoothProfile.STATE_DISCONNECTED) 
		            {
		                log("Disconnected from " + deviceString);
		                btGatts.remove(deviceString);
		                btData.remove(deviceString);
		                Intent broadcastIntent = new Intent(BT_CONNECT);
		            	broadcastIntent.putExtra(BT_CONNECT, false);
		            	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
		            	sendBroadcast(broadcastIntent);
		            }
		            btDeviceMutexes.get(deviceString).release();
		        }
		
		        @Override
		        public void onServicesDiscovered(BluetoothGatt gatt, int status) 
		        {
		        	log("onServicesDiscovered");
		        	String deviceString = getDeviceString(gatt.getDevice());
		        	try {btDeviceMutexes.get(deviceString).acquire();} catch (InterruptedException e) {}
		        	if(btGatts.containsKey(deviceString))
		        	{
		        		log("already connected");
		        		btDeviceMutexes.get(deviceString).release();
		        		return;
		        	}
		            if(status == BluetoothGatt.GATT_SUCCESS) 
		            {
		                BluetoothGattService gattService = gatt.getService(UUID_SERVICE);
		                if(gattService == null) 
		                {
		                    log("GATT service not found for " + deviceString);
		                    btDeviceMutexes.get(deviceString).release();
		                    return;
		                } 
		                log("GATT service found for " + deviceString);
		                
		                BluetoothGattCharacteristic receiveCharacteristic =
		                		gattService.getCharacteristic(UUID_RECEIVE);
		                if(receiveCharacteristic != null) 
		                {
		                    BluetoothGattDescriptor receiveConfigDescriptor =
		                            receiveCharacteristic.getDescriptor(UUID_CLIENT_CONFIGURATION);
		                    if(receiveConfigDescriptor != null) 
		                    {
		                    	// Set up to receive data from device
		                        gatt.setCharacteristicNotification(receiveCharacteristic, true);
		                        receiveConfigDescriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
		                        gatt.writeDescriptor(receiveConfigDescriptor);
		                        log("wrote config descriptor for " + deviceString);
		                        
		                        btGatts.put(deviceString, gatt);
		                        btData.put(deviceString, newBtData());
		                        heartbeatTimes.put(deviceString, curTime());
		                        // Broadcast successfull connection
		                        Intent broadcastIntent = new Intent(BT_CONNECT);
		                    	broadcastIntent.putExtra(BT_CONNECT, true);
		                    	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
		                    	sendBroadcast(broadcastIntent);
		                    } 
		                    else 
		                    	log("could not find config descriptor for " + deviceString);
		                } 
		                else
		                	log("could not find receive characteristic for " + deviceString);
		            } 
		            else 
		                log("could not discover services for " + deviceString + ": " + status);
		            btDeviceMutexes.get(deviceString).release();
		        }
		
		        @Override
		        public void onCharacteristicRead(BluetoothGatt gatt,
		                                         BluetoothGattCharacteristic characteristic,
		                                         int status) 
		        {
		        	log("characteristic read");
		            if (status == BluetoothGatt.GATT_SUCCESS) 
		            {
		            	log("characteristic read success");
		            	onCharacteristicChanged(gatt, characteristic);
		            }
		        }
		 
		        @Override 
		        public void onCharacteristicChanged(BluetoothGatt gatt,
		                                            BluetoothGattCharacteristic characteristic) {
		        	log("characteristic changed");
		        	String deviceString = getDeviceString(gatt.getDevice());
		        	try{btDeviceMutexes.get(deviceString).acquire();} catch (InterruptedException e) {}
		        	gotBtBytes(deviceString, characteristic.getValue());
		        	btDeviceMutexes.get(deviceString).release();
		        } 
		    }; 
		}
		return (BluetoothGattCallback) gattCallback;
	}
	
    // Receiver for finding classic bluetooth devices
    private final BroadcastReceiver receiverClassicDevice = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) 
        {
            String action = intent.getAction();
            // When discovery finds a device
            if(BluetoothDevice.ACTION_FOUND.equals(action)) 
            {
                // Get the BluetoothDevice object from the Intent
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if(device == null)
                	return;
                String deviceString = getDeviceString(device);
                log("Classic scan sees device " + deviceString);
                try {btDevicesMutex.acquire();} catch (InterruptedException e) {}
                if(!btDevices.containsKey(deviceString))
                {
                	log("sending broadcast for new device " + getName(deviceString));
	                btDevices.put(deviceString, device);
	                btDeviceBLE.put(deviceString, false);
	                Intent broadcastIntent = new Intent(BT_NEW_DEVICE);
	            	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
	            	sendBroadcast(broadcastIntent);
                }
                btDevicesMutex.release();
            }
        }
    };
    
    // Receiver for when classic discovery finishes
   	private final BroadcastReceiver receiverDiscoveryDone = new BroadcastReceiver() {
   	    public void onReceive(Context context, Intent intent) {
   	    	String action = intent.getAction();
   	    	if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action))
   	    	{
   		    	scanningClassic = false;
   		    	if(!scanningLE)
   		    	{
	   		    	Intent broadcastIntent = new Intent(BT_SCAN);
	            	broadcastIntent.putExtra(BT_SCAN, false);
	            	sendBroadcast(broadcastIntent);
   		    	}
   		    }
   	    }
   	};
   	
    // Receiver for connecting to classic bluetooth devices
    private final BroadcastReceiver receiverClassicUUID = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) 
        {
            String action = intent.getAction();
            // When uuid of a device is found
            if(BluetoothDevice.ACTION_UUID.equals(action)) 
            {
            	final BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
            	if(device == null || btDeviceBLE == null)
            		return;
            	final String deviceString = getDeviceString(device);
            	if(!btDeviceBLE.containsKey(deviceString))
            		return;
            	try{btDeviceMutexes.get(deviceString).acquire();} catch(InterruptedException e) {}
            	
            	if(btDeviceBLE.get(deviceString))
            	{
            		btDeviceMutexes.get(deviceString).release();
            		return; 
            	}
            	if(btSockets.containsKey(deviceString))
            	{
            		btDeviceMutexes.get(deviceString).release();
            		return; 
            	}
            	
            	log("In UUID receiver for classic device " + deviceString);
            	Parcelable[] myParcelable = intent.getParcelableArrayExtra(BluetoothDevice.EXTRA_UUID);
            	if(myParcelable == null)
            	{
            		log("null parcelable array");
            		// If discovery is on, turn it off and try again
            		if(bluetoothAdapter.isDiscovering())
            		{
            			bluetoothAdapter.cancelDiscovery();
            			log("re-fetching UUID'");
            			device.fetchUuidsWithSdp();
            		}
            		btDeviceMutexes.get(deviceString).release();
            		return;
            	}
            	if(myParcelable[0] == null)
            	{
            		log("null parcelable entry");
            		log("length of array: " + myParcelable.length);
            		for(int i = 0; i < myParcelable.length; i++)
            			log("\tentry " + i + ": " + (myParcelable[i] == null ? "null" : myParcelable[i]));
            		btDeviceMutexes.get(deviceString).release();
            		return;
            	}
 	        	final UUID uuid = ((ParcelUuid) myParcelable[0]).getUuid();
 	        	
 	        	if(uuid == null)
 	        	{
 	        		log("Got null UUID for classic device " + deviceString);
 	        		btDeviceMutexes.get(deviceString).release();
 	        		return;
 	        	}
				// Connect to device
				new Thread(new Runnable() 
				{
					public void run()
					{
						try 
						{
							final BluetoothSocket socket = 
									device.createRfcommSocketToServiceRecord(uuid);
							socket.connect();
							btSockets.put(deviceString, socket);
							btData.put(deviceString, newBtData());
							heartbeatTimes.put(deviceString, curTime());
							log("Connected to classic device " + deviceString);
							// Create thread to listen on input stream for new data
							new Thread(new Runnable() {
								public void run()
								{
									InputStream in = null;
									while(btSockets.containsValue(socket))
									{
										log("classic receiver thread trying to get input stream");
										try 
										{
											in = socket.getInputStream();
											log("got input stream");
										} catch (IOException e) {}
										// Keep listening until socket is closed
										int nextChar = -1;
										while(btSockets.containsValue(socket))
										{
											try 
											{
												if(in.available() <= 0)
												{
													try {Thread.sleep(50);} 
													catch (InterruptedException e) {}
												}
												else
												{
													nextChar = in.read();
													gotBtByte(deviceString, (byte) nextChar);
												}
											} 
											catch (IOException e1) 
											{
												log("exception reading from stream");
											}
										}
										log("read receiver terminated loop");
									}
								}
							}).start();
							// Broadcast successful connection
	                        Intent broadcastIntent = new Intent(BT_CONNECT);
	                    	broadcastIntent.putExtra(BT_CONNECT, true);
	                    	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
	                    	sendBroadcast(broadcastIntent);
						} 
						catch (IOException e) 
						{
							log("Error connecting to classic device " + deviceString);
						}
						finally
						{
							btDeviceMutexes.get(deviceString).release();
						}
					}
				}).start();					
            }
        }
    };

    
	@Override
	public IBinder onBind(Intent intent) 
	{
		return binder;
	}
	
	@Override
	public void onCreate()
	{
		bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
		mHandler = new Handler();
		
		// Record available devices
	    btDevices = new HashMap<String, BluetoothDevice>();
	    btDeviceBLE = new HashMap<String, Boolean>();
	    btDevicesMutex = new Semaphore(1, true);
	    scanningLE = false;
	    scanningClassic = false;
	    // Record connected devices
	    btGatts = new HashMap<String, BluetoothGatt>();
	    btSockets = new HashMap<String, BluetoothSocket>();
	    btData = new HashMap<String, byte[]>();
	    btDeviceMutexes = new HashMap<String, Semaphore>();
	    
		registerReceiver(receiverAdapterState, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
		registerReceiver(receiverClassicDevice, new IntentFilter(BluetoothDevice.ACTION_FOUND));
		registerReceiver(receiverClassicUUID, new IntentFilter(BluetoothDevice.ACTION_UUID));
		registerReceiver(receiverDiscoveryDone, new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED));
		
		final long heartbeatStartTime = curTime();
		// Start heartbeat sender
		heartbeatTimes = new HashMap<String, Long>();
		new Thread(new Runnable() {
			@Override
			public void run()
			{
				while(heartbeatEnabled)
				{
					log("pinger sleeping until half");
					// Sleep until we reach a half-period 
					while((curTime() - heartbeatStartTime) % (HEARTBEAT_TIMEOUT/2) < 250)
					{
						try {Thread.sleep(100);} 
						catch (InterruptedException e) {}
					}
					while((curTime() - heartbeatStartTime) % (HEARTBEAT_TIMEOUT/2) >= 250)
					{
						try {Thread.sleep(100);} 
						catch (InterruptedException e) {}
					}
					log("pinger checking devices");
					// Send pings to devices that are in danger of timing out
					ArrayList<String> devices = new ArrayList<String>();
					devices.addAll(btSockets.keySet());
					devices.addAll(btGatts.keySet());
					for(String next : devices)
						if(curTime() - heartbeatTimes.get(next) >= HEARTBEAT_TIMEOUT/2)
						{
							log("pinging device " + next);
							send(next, heartbeatString);
						}
					
					log("pinger sleeping until start");
					// Sleep until start of next timeout cycle
					while((curTime() - heartbeatStartTime) % HEARTBEAT_TIMEOUT > 250)
					{
						try {Thread.sleep(100);} 
						catch (InterruptedException e) {}
					}
				}
			}
		}).start();
		
		// Start heartbeat checker
		new Thread(new Runnable() {
			@Override
			public void run()
			{
				while(heartbeatEnabled)
				{
					log("terminator sleeping until start");
					// Sleep until we reach a timeout cycle start 
					while((curTime() - heartbeatStartTime) % (HEARTBEAT_TIMEOUT) < 250)
					{
						try {Thread.sleep(100);} 
						catch (InterruptedException e) {}
					}
					while((curTime() - heartbeatStartTime) % (HEARTBEAT_TIMEOUT) >= 250)
					{
						try {Thread.sleep(100);} 
						catch (InterruptedException e) {}
					}
					log("terminator checking devices");
					// Disconnect any timed-out devices
					ArrayList<Map.Entry> entries = new ArrayList<Map.Entry>();
					entries.addAll(heartbeatTimes.entrySet());
					for(Map.Entry entry : entries)
					{
						String deviceString = (String) entry.getKey();
						Long deviceTime = (Long) entry.getValue();
						log("see time " + deviceTime + ", curtime is " + curTime());
						if(curTime() - deviceTime > HEARTBEAT_TIMEOUT)
						{
							log("timed out device " + deviceString);
							disconnect(deviceString);
						}
					}
				}
			}
		}).start();
	}
	
	@Override
	public void onDestroy()
	{
		try{unregisterReceiver(receiverAdapterState);} catch(IllegalArgumentException e) {};
		try{unregisterReceiver(receiverClassicDevice);} catch(IllegalArgumentException e) {};
		try{unregisterReceiver(receiverClassicUUID);} catch(IllegalArgumentException e) {};
		try{unregisterReceiver(receiverDiscoveryDone);} catch(IllegalArgumentException e) {};
	}
    
	/**
     * Class used for the client Binder.  Because we know this service always
     * runs in the same process as its clients, we don't need to deal with IPC.
     */
    public class LocalBinder extends Binder 
    {
    	BluetoothService getService() 
    	{
            // Return this instance of LocalService so clients can call public methods
            return BluetoothService.this;
        }
    }
    
	//===================================================================
	// Bluetooth functions
	//===================================================================
    
    /**
     * Enable bluetooth if not already enabled
     */
    public void enableBluetooth()
    {
    	if(!bluetoothAdapter.isEnabled())
    	{
	    	log("enabling bluetooth");
	    	Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
	    	enableBtIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
	    	startActivity(enableBtIntent);
    	}
    }
    
    /**
     * Check if bluetooth is enabled
     */
    public boolean isEnabled()
    {
    	return bluetoothAdapter.isEnabled();
    }
    
    /**
     * Scan for devices (will broadcast each name, and stop after timeout)
     */
    public boolean scan()
    {
    	log("scan waiting for mutex");
    	try {btDevicesMutex.acquire();} catch (InterruptedException e) {}
    	log("scan got mutex");
    	btDevices.clear();
    	btDeviceBLE.clear();
    	if(BLE)
    	{
	        // Start the LE scan
	        if(bluetoothAdapter.startLeScan((BluetoothAdapter.LeScanCallback) getLeScanCallback()))
	        {
	        	scanningLE = true;
	        	// Stop scanning after a pre-defined scan period.
		        mHandler.postDelayed(new Runnable() 
		        {
		            @Override
		            public void run() 
		            {
		            	bluetoothAdapter.stopLeScan((BluetoothAdapter.LeScanCallback) getLeScanCallback());
		            	scanningLE = false;
//		            	if(!scanningClassic)
//		            	{
//			            	Intent broadcastIntent = new Intent(BT_SCAN);
//			            	broadcastIntent.putExtra(BT_SCAN, false);
//			            	sendBroadcast(broadcastIntent);
//		            	}
		            	// Classic Bluetooth
		        		if(bluetoothAdapter.startDiscovery())
		        			scanningClassic = true;
		            }
		        }, BLE_SCAN_PERIOD);
	        }
    	}
    	
//    	// Classic Bluetooth
		if(!BLE && bluetoothAdapter.startDiscovery())
			scanningClassic = true;
		
    	// Let others know that scan has begun
    	if(scanningLE || scanningClassic)
    	{
    		Intent broadcastIntent = new Intent(BT_SCAN);
    		broadcastIntent.putExtra(BT_SCAN, true);
    		sendBroadcast(broadcastIntent);
    	}
    	btDevicesMutex.release();
        return false;
    }
    
    /**
     * Check whether scan is in progress
     */
    public boolean isScanning()
    {
    	return scanningLE || scanningClassic;
    }
    
    /**
     * Scan callback (device found)
     */
    private Object leScanCallback = null;
    private BluetoothAdapter.LeScanCallback getLeScanCallback()
    {
    	if(leScanCallback == null)
    	{
	    	leScanCallback = new BluetoothAdapter.LeScanCallback() 
	    	{
		    	@Override
				public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) 
		    	{
		    		if(device == null)
		        		return;
		        	try {btDevicesMutex.acquire();} catch (InterruptedException e) {}
		        	String deviceString = getDeviceString(device);
		        	log("LE scan sees device " + deviceString);
		        	
		        	if(!btDevices.containsKey(deviceString))
		            {
		            	//log("see new device\n" + helper.getDeviceInfoText(device, rssi, scanRecord), 1);
		            	log("LE scan sees new device: " + deviceString);
		            	btDevices.put(deviceString, device);
		            	Intent broadcastIntent = new Intent(BT_NEW_DEVICE);
		            	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
		            	sendBroadcast(broadcastIntent);
		            }
		            btDeviceBLE.put(deviceString, true);
		            btDevicesMutex.release();
		    	}
	    	};
    	}
    	return (BluetoothAdapter.LeScanCallback) leScanCallback;
    }
    
    /**
     * Connect to device with the given name
     */
    public void connect(String deviceString)
    {
    	try {btDevicesMutex.acquire();} catch (InterruptedException e) {}
    	final BluetoothDevice device = btDevices.get(deviceString);
    	if(device == null)
    	{
    		btDevicesMutex.release();
    		return;
    	}
    	// Cancel discovery / scanning
    	if(BLE)
    		bluetoothAdapter.stopLeScan((BluetoothAdapter.LeScanCallback) getLeScanCallback());
		bluetoothAdapter.cancelDiscovery();
		
    	boolean isBLE = isBLE(deviceString);
    	log("starting to connect to " + deviceString + "(" + (isBLE ? "BLE" : "classic") + ")");
    	btDeviceMutexes.put(deviceString, new Semaphore(1, true));
		
    	if(isBLE)
    	{
	    	new Thread(new Runnable() {
    			public void run()
    			{
    				while(scanningClassic)
    				{
    					try {Thread.sleep(100);} 
    					catch (InterruptedException e) {}
    				}
    				log("connecting using gatt");
    		    	device.connectGatt(BluetoothService.this, false, (BluetoothGattCallback) getGattCallback());
    			}
    		}).start();
    	}
    	else if(!btSockets.containsKey(deviceString))
    	{
    		// Wait for discovery to complete and then connect to classic device
    		new Thread(new Runnable() {
    			public void run()
    			{
    				while(scanningClassic)
    				{
    					try {Thread.sleep(100);} 
    					catch (InterruptedException e) {}
    				}
    				device.fetchUuidsWithSdp();
    			}
    		}).start();
    	}
    	btDevicesMutex.release();
    }
    
    /**
     * Disconnect from device with the given name
     */
    public void disconnect(String deviceString)
    {
    	log("disconnect called on " + deviceString);
    	if(btDeviceBLE == null)
    		return;
    	if(isBLE(deviceString))
    	{
    		BluetoothGatt gatt = btGatts.get(deviceString);
    		// Disconnect device
        	if(gatt != null)
        		gatt.disconnect(); // will clean up arrays and whatnot in receiver
    	}
    	else
    	{
    		BluetoothSocket socket = btSockets.get(deviceString);
    		if(socket != null)
        	{
        		btSockets.remove(deviceString);
        		btData.remove(deviceString);
        		try 
        		{
        			socket.getInputStream().close();
    				socket.getOutputStream().close();
    				socket.close();
    			} catch (IOException e) {}
        		Intent broadcastIntent = new Intent(BT_CONNECT);
            	broadcastIntent.putExtra(BT_CONNECT, false);
            	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
            	sendBroadcast(broadcastIntent);
        	}
    	}
    }
    
    /**
     * Send data to the device with the given name
     */
    public boolean send(String deviceString, byte[] data) 
    {
    	log("send waiting for mutex");
    	try{btDeviceMutexes.get(deviceString).acquire();} catch(InterruptedException e) {}
    	log("sending data of length " + data.length + " to " + getName(deviceString));
    	// Make sure data is null terminated
        if(data.length == 0 || data[data.length-1] != '\0')
        {
        	byte newData[] = new byte[data.length+1]; 
        	for(int i = 0; i < data.length; i++)
        		newData[i] = data[i];
        	newData[newData.length-1] = '\0'; 
        	data = newData;
        }
        final byte[] toSend = data;
        
    	if(isBLE(deviceString))
    	{
    		BluetoothGatt gatt = btGatts.get(deviceString);
    		if(gatt == null)
    		{
    			log("send could not find gatt for device " + deviceString);
    			btDeviceMutexes.get(deviceString).release();
        		return false;
    		}
    		// Send data
    		BluetoothGattCharacteristic characteristic =
	                gatt.getService(UUID_SERVICE).getCharacteristic(UUID_SEND);
	
	        if(characteristic == null) 
	        {
	            log("send could not find characteristic for " + deviceString);
	            btDeviceMutexes.get(deviceString).release();
	            return false;
	        }
	        
	        characteristic.setValue(toSend);
	        characteristic.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE);
	        btDeviceMutexes.get(deviceString).release();
	        return gatt.writeCharacteristic(characteristic);
    	}
    	else
    	{
    		final BluetoothSocket socket = btSockets.get(deviceString);
    		if(socket == null)
    		{
    			log("send could not find socket for device " + deviceString);
    			btDeviceMutexes.get(deviceString).release();
        		return false;
    		}
    		// Send data
    		new Thread(new Runnable() {
				public void run()
				{
					try
					{
						log("sending data to classic device");
						OutputStream out = socket.getOutputStream();
						out.write(toSend);
					}
					catch(IOException e) {}
				}
			}).start();
    		btDeviceMutexes.get(deviceString).release();
			return true;
    	}
    }
    
    public boolean send(String deviceString, String data)
    {
    	
    	byte[] dataBytes = new byte[data.length()+1];
    	for(int i = 0; i < data.length(); i++)
    		dataBytes[i] = (byte) data.charAt(i);
    	dataBytes[data.length()] = (byte)'\0';
    	return send(deviceString, dataBytes);
    }
    
    private void gotBtByte(String deviceString, byte received)
    {
    	log("got BT char " + (char)received);
    	byte[] curData = btData.get(deviceString);
    	curData[btDataLength(curData)] = received;
    	curData[btDataLength(curData)] = '\0';
    	if(received == '\0')
    	{
    		// Create new array of proper length
    		byte toSend[] = new byte[btDataLength(curData)+1];
    		for(int i = 0; i < toSend.length-1; i++)
    			toSend[i] = curData[i];
    		toSend[toSend.length-1] = '\0';
    		
    		// Check if it is a heartbeat response
    		boolean isHeartbeat = true;
    		for(int i = 0; isHeartbeat && i < heartbeatString.length; i++) 
    			isHeartbeat = heartbeatString[i] == toSend[i];
    				
    		if(isHeartbeat)
    			log("got heartbeat from " + deviceString);
    		else if(btDataLength(curData) > 0)
    		{
	    		// Broadcast data
	    		log("broadcasting data of length " + btDataLength(curData));
	        	Intent broadcastIntent = new Intent(BT_DATA);
	        	broadcastIntent.putExtra(BT_DEVICE_STRING, deviceString);
	        	broadcastIntent.putExtra(BT_DATA, toSend);
	        	sendBroadcast(broadcastIntent);
    		}
    		// Start new data array
        	log("starting new byte array for device " + deviceString);
     		btData.put(deviceString, newBtData());
    	}
    	heartbeatTimes.put(deviceString, curTime());  
    }
    
    private void gotBtBytes(String deviceString, byte[] received)
    {
    	log("see byte array " + received + " of length " + received.length + " from " + deviceString);  
    	for(int i = 0; i < received.length; i++)
    	{
    		gotBtByte(deviceString, received[i]);
    	}
    }
	
    public boolean isConnected(String deviceString)
    {
    	return (btGatts.containsKey(deviceString) || btSockets.containsKey(deviceString));
    }
    
    public ArrayList<String> getConnectedDeviceStrings()
    {
    	ArrayList<String> res = new ArrayList<String>();
    	if(BLE)
    		res.addAll(btGatts.keySet());
    	res.addAll(btSockets.keySet());
    	return res;
    }
    
    public String getName(String deviceString)
    {
    	return deviceString.substring(0, deviceString.indexOf("::"));
    }
    
 	//===================================================================
    // Helper functions
    //===================================================================
    private String getDeviceString(BluetoothDevice device)
    {
    	int type = BLE ? device.getType() : 1;
    	return device.getName() + "::" + type + "@" + device.getAddress();
    }
    
    private boolean isBLE(String deviceString)
    {
    	if(btDevices.containsKey(deviceString))
    		return btDeviceBLE.get(deviceString);
    	if(btSockets.containsKey(deviceString))
    		return false;
    	if(BLE && btGatts.containsKey(deviceString))
    		return true;
    	return false;
    }
    
    private int btDataLength(byte[] array)
    {
    	int length = 0;
    	for(; length < MAX_BTDATA_LENGTH; length++)
    		if(array[length] == '\0')
    			break;
    	return length;
    }
    
    private byte[] newBtData()
    {
    	byte res[] = new byte[MAX_BTDATA_LENGTH];
    	res[0] = '\0';
    	return res;
    }
    
    private long curTime()
    {
    	return Calendar.getInstance().getTimeInMillis();
    }
    
    private void log(String message)
	{
		log(message, 0);
	}
	
	private void log(String message, int level)
	{
		String indent = "";
		for(int i = 0; i < level; i++)
			indent += " ";
		Log.i("RobotLog", "BluetoothService: " + indent + message.replace("\n", "\n" + indent)); 
	}
	
	public class BluetoothHelper {
	    public String shortUuidFormat = "0000%04X-0000-1000-8000-00805F9B34FB";

	    public UUID sixteenBitUuid(long shortUuid) {
	        assert shortUuid >= 0 && shortUuid <= 0xFFFF;
	        return UUID.fromString(String.format(shortUuidFormat, shortUuid & 0xFFFF));
	    }

	    public String getDeviceInfoText(BluetoothDevice device, int rssi, byte[] scanRecord) {
	        return new StringBuilder()
	                .append("Name: ").append(device.getName())
	                .append("\nMAC: ").append(device.getAddress())
	                .append("\nRSSI: ").append(rssi)
	                .append("\nScan Record:").append(parseScanRecord(scanRecord))
	                .toString();
	    }

	    // Bluetooth Spec V4.0 - Vol 3, Part C, section 8
	    private String parseScanRecord(byte[] scanRecord) {
	        StringBuilder output = new StringBuilder();
	        int i = 0;
	        while (i < scanRecord.length) {
	            int len = scanRecord[i++] & 0xFF;
	            if (len == 0) break;
	            switch (scanRecord[i] & 0xFF) {
	                // https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
	                case 0x0A: // Tx Power
	                    output.append("\n  Tx Power: ").append(scanRecord[i+1]);
	                    break;
	                case 0xFF: // Manufacturer Specific data (RFduinoBLE.advertisementData)
	                    output.append("\n  Advertisement Data: ")
	                            .append(bytesToHex(scanRecord, i + 3, len));

	                    String ascii = bytesToAsciiMaybe(scanRecord, i + 3, len);
	                    if (ascii != null) {
	                        output.append(" (\"").append(ascii).append("\")");
	                    }
	                    break;
	            }
	            i += len;
	        }
	        return output.toString();
	    }
	    
	    public String bytesToHex(byte[] data, int offset, int length) {
	        if (length <= 0) {
	            return "";
	        }

	        StringBuilder hex = new StringBuilder();
	        for (int i = offset; i < offset + length; i++) {
	            hex.append(String.format(" %02X", data[i] % 0xFF));
	        }
	        hex.deleteCharAt(0);
	        return hex.toString();
	    }
	    
	    public String bytesToAsciiMaybe(byte[] data) {
	        return bytesToAsciiMaybe(data, 0, data.length);
	    }
	    
	    public String bytesToAsciiMaybe(byte[] data, int offset, int length) {
	        StringBuilder ascii = new StringBuilder();
	        boolean zeros = false;
	        for (int i = offset; i < offset + length; i++) {
	            int c = data[i] & 0xFF;
	            if (isPrintableAscii(c)) {
	                if (zeros) {
	                    return null;
	                }
	                ascii.append((char) c);
	            } else if (c == 0) {
	                zeros = true;
	            } else {
	                return null;
	            }
	        }
	        return ascii.toString();
	    }
	    
	    public boolean isPrintableAscii(int c) {
	        return c >= PRINTABLE_ASCII_MIN && c <= PRINTABLE_ASCII_MAX;
	    }
	    
	    public int PRINTABLE_ASCII_MIN = 0x20; // ' '
	    public int PRINTABLE_ASCII_MAX = 0x7E; // '~'
	}
	
	
}


