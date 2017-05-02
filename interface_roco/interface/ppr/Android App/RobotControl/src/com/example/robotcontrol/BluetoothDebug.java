package com.example.robotcontrol;

import java.util.ArrayList;
import java.util.HashMap;

import com.example.robotcontrol.BluetoothService.LocalBinder;

import android.os.Bundle;
import android.os.IBinder;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.graphics.Paint;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

public class BluetoothDebug extends Activity 
{ 
	private BluetoothService btService;
	private boolean btBound;
	private LinearLayout deviceListLayout;
	private Button enableButton;
	private Button scanButton;
	private Button connectButton;
	private Button sendValueButton;
	private Button sendZeroButton;
	private HashMap<String, String> receivedData;
	private TextView receivedDataTV;
	private String selectedDevice;
	
	// Create broadcast receiver for when BluetoothService finds a new device 
	private BroadcastReceiver receiverNewBtDevice = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) 
			{ 
				String action = intent.getAction();
				if(action.equals(BluetoothService.BT_NEW_DEVICE))
				{
					log("Debug receiver for new device");
					String deviceString = intent.getStringExtra(BluetoothService.BT_DEVICE_STRING);
					// Check if device is already listed
					// This would happen if device was connected when scan started
					// but then was disconnected during scan and re-discovered
					for(int i = 0; i < deviceListLayout.getChildCount(); i++)
						if(((TextView) deviceListLayout.getChildAt(i)).getText().toString().equals(deviceString))
							return;
					TextView newTV = new TextView(BluetoothDebug.this);
					newTV.setText(deviceString);
					newTV.setOnClickListener(new TextView.OnClickListener() {
						@Override
						public void onClick(View view) 
						{
							selectedDevice = ((TextView) view).getText().toString();
							boolean connected = btService.isConnected(selectedDevice);
							connectButton.setText(connected ? "Disconnect" : "Connect");
							connectButton.setEnabled(true);
							sendValueButton.setEnabled(connected);
				        	sendZeroButton.setEnabled(connected);
				        	if(receivedData.containsKey(selectedDevice))
				        		receivedDataTV.setText(receivedData.get(selectedDevice));
				        	else
				        		receivedDataTV.setText("");
				        	// Underline device in list
				        	for(int i = 0; i < deviceListLayout.getChildCount(); i++)
				        	{
				        		TextView tv = (TextView) deviceListLayout.getChildAt(i);
				        		String deviceString = tv.getText().toString();
				        		if(deviceString.equals(selectedDevice))
				        			tv.setPaintFlags(tv.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG | Paint.FAKE_BOLD_TEXT_FLAG);
				        		else
				        			tv.setPaintFlags(tv.getPaintFlags() & ~Paint.UNDERLINE_TEXT_FLAG & ~Paint.FAKE_BOLD_TEXT_FLAG);
				        	}
						}
					});
					LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
							LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
					params.setMargins(0, (int)getResources().getDimension(R.dimen.activity_vertical_margin_half),
							0, (int)getResources().getDimension(R.dimen.activity_vertical_margin_half));
					deviceListLayout.addView(newTV, params);
				}
			}
		};
	// Create broadcast receiver for when bluetooth is enabled 
	private BroadcastReceiver receiverBtEnable = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) 
			{
				String action = intent.getAction();
				if(action.equals(BluetoothService.BT_ENABLE))
				{
					if(enableButton != null)
						enableButton.setEnabled(!btService.isEnabled());
					if(scanButton != null)
						scanButton.setEnabled(btService.isEnabled());
				}
			}
		};
	// Create broadcast receiver for when bluetooth is scanning or not scanning 
	private BroadcastReceiver receiverBtScan = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) 
			{
				String action = intent.getAction();
				if(action.equals(BluetoothService.BT_SCAN))
				{
					if(btService.isScanning())
					{
						scanButton.setEnabled(false);
						for(int i = 0; i < deviceListLayout.getChildCount(); i++)
						{
							String deviceString = ((TextView) deviceListLayout.getChildAt(i)).getText().toString();
							if(!btService.isConnected(deviceString))
							{
								deviceListLayout.removeViewAt(i--);
								if(selectedDevice.equals(deviceString))
								{
									connectButton.setEnabled(false);
									sendValueButton.setEnabled(false);
									sendZeroButton.setEnabled(false);
								}
							}
						}
					}
					else
						scanButton.setEnabled(true);
				}
			}
		};
	// Create broadcast receiver for when bluetooth is connected 
	private BroadcastReceiver receiverBtConnect = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) 
			{
				String action = intent.getAction();
				if(action.equals(BluetoothService.BT_CONNECT))
				{
					String deviceString = intent.getStringExtra(BluetoothService.BT_DEVICE_STRING);
					boolean connected = intent.getBooleanExtra(BluetoothService.BT_CONNECT, false);
					
					for(int i = 0; i < deviceListLayout.getChildCount(); i++)
					{
						TextView view = (TextView) deviceListLayout.getChildAt(i);
						if(view.getText().toString().equals(deviceString))
							view.setTextColor(getResources().getColor(
									connected ? R.color.green : R.color.black));
					}
					if(!receivedData.containsKey(deviceString))
						receivedData.put(deviceString, "");
					
					if(selectedDevice.equals(deviceString))
					{
						sendValueButton.setEnabled(connected);
						sendZeroButton.setEnabled(connected);
						connectButton.setText(connected ? "Disconnect" : "Connect");
						receivedDataTV.setText(receivedData.get(selectedDevice));
					}
				}
			}
		};
	// Create broadcast receiver for when bluetooth gets data 
	private BroadcastReceiver receiverBtData = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) 
			{
				String action = intent.getAction();
				if(action.equals(BluetoothService.BT_DATA))
				{
					String deviceString = intent.getStringExtra(BluetoothService.BT_DEVICE_STRING);
					byte[] dataBytes = intent.getByteArrayExtra(BluetoothService.BT_DATA);
					log("got bt data " + dataBytes.toString() + " length " + dataBytes.length);
					String data = "";
					for(int i = 0; i < dataBytes.length; i++)
					{
						data += (char)dataBytes[i];
						log(dataBytes[i] + "");
					}
					receivedData.put(deviceString, receivedData.get(deviceString) 
							+ "\t\t<" + data.replace("\n",  "\t\t\n") + ">\n");
					receivedDataTV.setText(receivedData.get(deviceString));
				}
			}
		};
			
    @Override
    protected void onCreate(Bundle savedInstanceState) 
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bluetooth_debug);
        deviceListLayout = (LinearLayout) findViewById(R.id.btDebug_ll_deviceInfo);
        enableButton = (Button) findViewById(R.id.btDebug_button_enableBluetooth);
        scanButton = (Button) findViewById(R.id.btDebug_button_scan);
        connectButton = (Button) findViewById(R.id.btDebug_button_connect);
        receivedDataTV = (TextView) findViewById(R.id.btDebug_tv_data);
        sendValueButton = (Button) findViewById(R.id.btDebug_button_sendValue); 
        sendZeroButton = (Button) findViewById(R.id.btDebug_button_sendZero); 
        selectedDevice = "";
        
        enableButton.setEnabled(true);
        scanButton.setEnabled(false);
        connectButton.setEnabled(false);
        sendValueButton.setEnabled(false);
        sendZeroButton.setEnabled(false);
        
        receivedData = new HashMap<String, String>();
        
        // Register broadcast receivers
    	registerReceiver(receiverNewBtDevice, new IntentFilter(BluetoothService.BT_NEW_DEVICE));
    	registerReceiver(receiverBtEnable, new IntentFilter(BluetoothService.BT_ENABLE));
    	registerReceiver(receiverBtScan, new IntentFilter(BluetoothService.BT_SCAN));
    	registerReceiver(receiverBtConnect, new IntentFilter(BluetoothService.BT_CONNECT));
    	registerReceiver(receiverBtData, new IntentFilter(BluetoothService.BT_DATA));
    	
    	// Start service (so it won't be closed after each call)
    	// TODO check the lifecycles to read about this?
    	startService(new Intent(this, BluetoothService.class));
    	
    	// Bind to BluetoothService
    	log("Binding to btService"); 
    	btBound = false;
        Intent intent = new Intent(this, BluetoothService.class);
        bindService(intent, btConnection, Context.BIND_AUTO_CREATE);
        
        ((EditText) findViewById(R.id.btDebug_et_value)).setText("Hello");
    }

    protected void onStart()
    {
    	super.onStart();
    }
    
    protected void onStop()
    {
    	super.onStop();
    }
    
    protected void onDestroy()
    {
    	// Unbind from the service
        if(btBound) 
        {
            unbindService(btConnection);
            btBound = false;
        }
        
    	// Unregister receivers
        try{unregisterReceiver(receiverNewBtDevice);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtEnable);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtScan);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtConnect);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtData);} catch(IllegalArgumentException e) {};
        
        super.onDestroy();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) 
    {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    @Override
	public boolean onOptionsItemSelected(MenuItem item)
	{
		// Respond to action bar buttons
		switch(item.getItemId())
		{
			case R.id.action_bluetooth_debug:
				Intent debugIntent = new Intent(this, BluetoothDebug.class);
				startActivity(debugIntent);
				break;
			default:
				super.onOptionsItemSelected(item);
		}
		return true;
	}

    
    /** Defines callbacks for service binding, passed to bindService() */
    private ServiceConnection btConnection = new ServiceConnection() 
    {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) 
        {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            LocalBinder binder = (LocalBinder) service;
            btService = binder.getService();
            btBound = true;
            log("Connected to btService");
            // Enable bluetooth
            if(btService.isEnabled())
            {
            	enableButton.setEnabled(false);
            	scanButton.setEnabled(true);
            }
            else
            {
            	btService.enableBluetooth();
            	enableButton.setEnabled(true);
            	scanButton.setEnabled(false);
            }
            connectButton.setEnabled(false);
            sendValueButton.setEnabled(false);
        	sendZeroButton.setEnabled(false);
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) 
        {
            btBound = false;
            log("Disconnected from btService");
        }
    };

    //===================================================================
    // Button callbacks
    //===================================================================
    public void enableBluetooth(View view)
    {
    	// Enable bluetooth if it is not enabled
        btService.enableBluetooth();
    }
    
    public void scan(View view)
    {
    	// Clear device list and start scan
    	// Note that broadcast receivers will enable/disable this button
    	btService.scan();
    }
    
    public void connect(View view)
    {
    	if(!btService.isConnected(selectedDevice))
    		btService.connect(selectedDevice);
    	else
    		btService.disconnect(selectedDevice);
    	scanButton.setEnabled(true);
    }
    
    public void sendZero(View view)
    {
    	btService.send(selectedDevice, new byte[] {0});
    }
    
    public void sendValue(View view)
    {
    	String toSendStr = ((EditText) findViewById(R.id.btDebug_et_value)).getText().toString();
    	byte toSend[] = new byte[toSendStr.length()];
    	for(int i = 0; i < toSendStr.length(); i++)
    		toSend[i] = (byte) toSendStr.charAt(i);
    	btService.send(selectedDevice, toSend);
    }
    
    public void clearReceivedData(View view)
    {
    	updateData(selectedDevice, "");
    }
    
    //===================================================================
    // Helper functions
    //===================================================================
    private void updateData(String deviceString, String newData)
    {
    	receivedData.put(deviceString, newData);
    	if(selectedDevice.equals(deviceString))
    		receivedDataTV.setText(newData);
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
		Log.i("RobotLog", "Main: " + indent + message.replace("\n", "\n" + indent)); 
	}
}
