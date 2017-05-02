package com.example.robotcontrol;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;

import com.example.robotcontrol.BluetoothService.LocalBinder;

import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
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
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.LinearLayout.LayoutParams;
import android.widget.ToggleButton;

public class RobotUI extends Activity 
{
	private BluetoothService btService;
	private boolean connected;
	private String deviceString;
	private HashMap<Integer, UIElement<? extends View>> elements;
	private LinearLayout layout;
	private TextView status;
	
	private final String UI_REQUEST = "UI_DESCRIPTION";
	
	// Callback for BT_Data should call parseElement and add it to the map
	// then call addElement
	
	@Override
	protected void onCreate(Bundle savedInstanceState) 
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_robot_ui);
		
		elements = new HashMap<Integer, UIElement<? extends View>>();
		layout = (LinearLayout) findViewById(R.id.robotUI_ll_layout);
		status = (TextView) findViewById(R.id.robotUI_tv_status);
		
		// Register broadcast receivers
    	registerReceiver(receiverNewBtDevice, new IntentFilter(BluetoothService.BT_NEW_DEVICE));
    	registerReceiver(receiverBtScan, new IntentFilter(BluetoothService.BT_SCAN));
    	registerReceiver(receiverBtConnect, new IntentFilter(BluetoothService.BT_CONNECT));
    	registerReceiver(receiverBtData, new IntentFilter(BluetoothService.BT_DATA));
    	
	}

	@Override
	public void onStart()
	{
		super.onStart();
		
		// Start service (so it won't be closed after each call)
    	// TODO check the lifecycles to read about this?
    	startService(new Intent(this, BluetoothService.class));
    	
    	// Bind to BluetoothService 
    	log("Binding to btService"); 
    	connected = false;
    	deviceString = "";
    	setStatus("Connecting to Bluetooth Service...");
        Intent intent = new Intent(this, BluetoothService.class);
        bindService(intent, btConnection, Context.BIND_AUTO_CREATE);
	}
	
	@Override
	public void onStop()
	{
		// Unbind from the service
        unbindService(btConnection);
        
    	// Unregister receivers
        try{unregisterReceiver(receiverNewBtDevice);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtScan);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtConnect);} catch(IllegalArgumentException e) {};
        try{unregisterReceiver(receiverBtData);} catch(IllegalArgumentException e) {};
        
        super.onStop();
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) 
	{
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.robot_ui, menu);
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
			case R.id.action_disconnect:
				btService.disconnect(this.deviceString);
				connected = false;
				break;
			case R.id.action_connect:
				btService.scan();
				break;
			default:
				super.onOptionsItemSelected(item);
		}
		return true;
	}
	
	private UIElement<View> parseElement(String description)
	{
		log("Parsing new element " + description);
		// Assumes following format:
		//  name$type$ID$dataSource$dataDest0,dataDest1,...$option
		String name = description.substring(0, description.indexOf('$'));
		description = description.substring(description.indexOf('$')+1);
		log("see name " + name);
		
		String type = description.substring(0, description.indexOf('$')).toLowerCase(Locale.getDefault());
		description = description.substring(description.indexOf('$')+1);
		log("see type " + type);
		
		String IDStr = description.substring(0, description.indexOf('$'));
		description = description.substring(description.indexOf('$')+1);
		int ID = 0;
		try{ID = Integer.parseInt(IDStr);}
		catch(NumberFormatException e){log("ID Exception");}
		log("see ID " + ID);
		
		String dataSourceStr = description.substring(0, description.indexOf('$'));
		description = description.substring(description.indexOf('$')+1);
		int dataSource = ID;
		try{dataSource = Integer.parseInt(dataSourceStr);}
		catch(NumberFormatException e){log("dataSource exception");}
		log("see dataSource " + dataSource);
		
		log("looking for data dest in " + description);
		ArrayList<Integer> dataDest = new ArrayList<Integer>();
		while(description.indexOf(',') >= 0 && description.indexOf(',') < description.indexOf('$'))
		{
			try{dataDest.add(Integer.parseInt(description.substring(0, description.indexOf(','))));
			log("got dest " + dataDest.get(dataDest.size()-1));}
			catch(NumberFormatException e) {}
			description = description.substring(description.indexOf(',')+1);
		}
		log("looking for final data dest in " + description);
		log("index of dollar char is " + description.indexOf('$'));
		log("index of dollar str is " + description.indexOf("$"));
		try{dataDest.add(Integer.parseInt(description.substring(0, description.indexOf('$'))));
		log("got final dest " + dataDest.get(dataDest.size()-1));}
		catch(NumberFormatException e) {}
		
		description = description.substring(description.indexOf('$')+1);
		String option = description.trim();
		log("got option " + option);
		
		return makeElement(name, type, ID, dataSource, dataDest, option);
	}
	
	@SuppressLint("NewApi") private UIElement<View> makeElement(String name, String type, final int ID, final int dataSource, final ArrayList<Integer> dataDest, final String option)
	{
		log("making element " + name + " of type " + type);
		type = type.toLowerCase(Locale.getDefault());
		if(type.contains("slider") || type.contains("seek"))
		{
			// Create layout to hold title and slider
			LinearLayout barLL = new LinearLayout(this);
			LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT, 1.0f);
			barLL.setLayoutParams(new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
			barLL.setOrientation(LinearLayout.HORIZONTAL);
			// Create title
			TextView title = new TextView(this);
			title.setText(name);
			barLL.addView(title, params);
			// Create slider
			final SeekBar bar = new SeekBar(this);
			bar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
				private int myID = ID;
						
				@Override
				public void onStopTrackingTouch(SeekBar seekBar) 
				{
				}
				
				@Override
				public void onStartTrackingTouch(SeekBar seekBar) 
				{
				}
				
				@Override
				public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) 
				{
					int min = 0;
					int max = 100;
					try
					{
						min = Integer.parseInt(option.substring(0, option.indexOf(",")).trim());
						max = Integer.parseInt(option.substring(option.indexOf(",")+1).trim());
					}
					catch(NumberFormatException e) {}
					sendBluetoothData(dataDest, min + (max-min)*progress/100);
				}
			});
			log("returning seekbar");
			params = new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT, 10.0f);
			barLL.addView(bar, params);
			return new UIElement<View>(name, ID, dataSource, dataDest, barLL) {
				@Override
				String getData() 
				{
					int min = 0;
					int max = 100;
					try
					{
						min = Integer.parseInt(option.substring(0, option.indexOf(",")).trim());
						max = Integer.parseInt(option.substring(option.indexOf(",")+1).trim());
					}
					catch(NumberFormatException e) {}
					return "" + (min + (max-min)*bar.getProgress()/100);
				}

				@Override
				void sendData() 
				{
					sendBluetoothData(dataDest, getData());
				}
			};
		}
		else if(type.contains("button"))
		{
			Button button = new Button(this);
			button.setText(name);
			button.setOnClickListener(new Button.OnClickListener() {
				private int myID = ID;
				private int myDataSource = dataSource;
				
				@Override
				public void onClick(View view)
				{
					String data = elements.get(myDataSource).getData();
					sendBluetoothData(dataDest, data);
				}
			});
			log("returning button");
			return new UIElement<View>(name, ID, dataSource, dataDest, button) {
				@Override
				String getData() 
				{
					if(dataSource == ID)
						return "";
					return elements.get(dataSource).getData();
				}

				@Override
				void sendData() 
				{
					sendBluetoothData(dataDest, getData());
				}
			};
		}
		else if(type.contains("togg")) // why does it sometimes send "toggl`Switch" ????
		{
			if(android.os.Build.VERSION.SDK_INT < 14)
				return makeElement(name, "checkbox", ID, dataSource, dataDest, option); 
			Switch toggle = new Switch(this);
			toggle.setText(name);
			toggle.setOnCheckedChangeListener(new Switch.OnCheckedChangeListener() {
				private int myID = ID;
				private int myDataSource = dataSource;

				@Override
				public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) 
				{
					String data = isChecked ? "1" : "0";
					sendBluetoothData(dataDest, data);
				}
			});
			log("returning toggle");
			return new UIElement<View>(name, ID, dataSource, dataDest, toggle) {
				@SuppressLint("NewApi") @Override
				String getData() 
				{
					if(dataSource == ID)
						return "";
					return ((Switch) getElement()).isChecked() ? "1" : "0";
				}

				@Override
				void sendData() 
				{
					sendBluetoothData(dataDest, getData());
				}
			};
		}
		else if(type.contains("checkbox"))
		{
			CheckBox checkbox = new CheckBox(this);
			checkbox.setText(name);
			checkbox.setOnCheckedChangeListener(new CheckBox.OnCheckedChangeListener() {
				private int myID = ID;
				private int myDataSource = dataSource;

				@Override
				public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) 
				{
					String data = isChecked ? "1" : "0";
					sendBluetoothData(dataDest, data);
				}
			});
			log("returning checkbox");
			return new UIElement<View>(name, ID, dataSource, dataDest, checkbox) {
				@SuppressLint("NewApi") @Override
				String getData() 
				{
					if(dataSource == ID)
						return "";
					return ((Switch) getElement()).isChecked() ? "1" : "0";
				}

				@Override
				void sendData() 
				{
					sendBluetoothData(dataDest, getData());
				}
			};
		}
		else if(type.contains("constant"))
		{
			log("returning constant");
			return new UIElement<View>(name, ID, dataSource, dataDest, null) {
				@Override
				String getData() 
				{ 
					return option;
				}

				@Override
				void sendData() 
				{
					sendBluetoothData(dataDest, getData());
				}
			};
		}
		else
		{
			log("returning null");
			return null;
		}
	}
	
	// Sends string of form "data$dest,dest..."
	private void sendBluetoothData(ArrayList<Integer> dataDest, String data)
	{
		log("sending data " + data);
		String toSend = data + "$";		
		for(int dest : dataDest) 
		{ 
			log("to dest " + dest); 
			toSend += dest + ",";
		}
		if(toSend.charAt(toSend.length()-1) == ',')
			toSend = toSend.substring(0, toSend.length()-1);
		log("sending <" + toSend + ">");
		btService.send(this.deviceString, toSend);
	}
	
	private void sendBluetoothData(ArrayList<Integer> dataDest, int data)
	{
		sendBluetoothData(dataDest, "" + data);
	}
	
	private void addElement(UIElement<View> element)
	{
		if(element == null)
		{
			log("null element!");
			return;
		}
		log("adding element " + element.getName());
		elements.put(element.getID(), element);
		if(element.getElement() != null)
		{
			log("adding the element to the layout");
			LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
			params.setMargins(0, (int) getResources().getDimension(R.dimen.activity_vertical_margin_half),
					0, (int) getResources().getDimension(R.dimen.activity_vertical_margin_half));
			layout.addView(element.getElement(), params);
		}
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
            log("Connected to btService");
            setStatus("Connected to Bluetooth Service");
            for(String next : btService.getConnectedDeviceStrings())
            	if(next.toLowerCase(Locale.getDefault()).contains("robot"))
            		deviceString = next;
            if(btService.isConnected(deviceString))
            	setStatus("Connected to <" + deviceString + ">");
            else
            	btService.scan();
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) 
        {
            log("Disconnected from btService");
            btService.scan();
        }
    };
    
    // Create broadcast receiver for when BluetoothService finds a new device 
 	private BroadcastReceiver receiverNewBtDevice = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) 
		{ 
			String action = intent.getAction();
			if(action.equals(BluetoothService.BT_NEW_DEVICE))
			{
				log("UI receiver for new device");
				String deviceString = intent.getStringExtra(BluetoothService.BT_DEVICE_STRING);
				// If already connected, do nothing
				if(connected)
					return;
				if(deviceString.toLowerCase(Locale.getDefault()).contains("robot"))
				{
					RobotUI.this.deviceString = deviceString;
					btService.connect(deviceString);
					setStatus("Connecting to <" + deviceString + ">");
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
					// Get data
					String deviceString = intent.getStringExtra(BluetoothService.BT_DEVICE_STRING);
					byte[] dataBytes = intent.getByteArrayExtra(BluetoothService.BT_DATA);
					log("got bt data " + dataBytes.toString() + " length " + dataBytes.length);
					String data = "";
					for(int i = 0; i < dataBytes.length; i++)
					{
						data += (char)dataBytes[i]; 
						log(dataBytes[i] + "");
					} 
					log("UI GOT DATA " + data);
					// Parse element string and add it to the layout
					addElement(parseElement(data));
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
						setStatus("Scanning for Bluetooth devics...");
					else if(!connected)
						setStatus("Completed Bluetooth scan");
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
					connected = intent.getBooleanExtra(BluetoothService.BT_CONNECT, false);
					if(connected)
					{
						setStatus("Connected to <" + deviceString + ">");
						Handler mHandler = new Handler();
						mHandler.postDelayed(new Runnable() 
				        {
				            @Override
				            public void run() 
				            {
				            	RobotUI.this.layout.removeAllViews();
								btService.send(RobotUI.this.deviceString, UI_REQUEST);
				            }
				        }, 1000);
					}
					else
					{
						setStatus("Disconnected from <" + deviceString + ">");
						RobotUI.this.deviceString = "";
					}
				}
			}
		};
	//===================================================================
    // Helper functions
    //===================================================================
	private void setStatus(String message)
	{
		status.setText(message);
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
		Log.i("RobotLog", "RobotUI: " + indent + message.replace("\n", "\n" + indent)); 
	}

}







