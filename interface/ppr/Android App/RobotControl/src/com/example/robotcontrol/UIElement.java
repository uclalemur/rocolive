package com.example.robotcontrol;

import java.util.ArrayList;

import android.view.View;

public abstract class UIElement<T extends View>
{
	private String name;
	private int ID;
	private int dataSource;
	private ArrayList<Integer> dataDest;
	private T element;
	
	UIElement(String name, int ID, int dataSource, ArrayList<Integer> dataDest, T element)
	{
		this.name = name;
		this.ID = ID;
		this.dataSource = dataSource;
		this.dataDest = new ArrayList<Integer>();
		if(dataDest != null)
			this.dataDest.addAll(dataDest);
		this.element = element;
	}
	
	UIElement(String name, int ID)
	{
		this(name, ID, -1, null, null);
	}
	
	UIElement()
	{
		this("Default", -1);
	}
	
	int getID()
	{
		return ID;
	}
	
	String getName()
	{
		return name;
	}
	
	void setName(String name)
	{
		this.name = name;
	}
	
	void setDataSource(int dataSource)
	{
		this.dataSource = dataSource;
	}
	
	int getDataSource()
	{
		return dataSource;
	}
	
	ArrayList<Integer> getDataDest()
	{
		return dataDest;
	}
	
	void setDataDest(ArrayList<Integer> dataDest)
	{
		if(dataDest == null)
			return;
		if(this.dataDest == null)
			this.dataDest = new ArrayList<Integer>();
		this.dataDest.clear();
		this.dataDest.addAll(dataDest);
	}
	
	void addDataDest(int dataDest)
	{
		if(this.dataDest == null)
			this.dataDest = new ArrayList<Integer>();
		this.dataDest.add(dataDest);
	}
	
	void setElement(T element)
	{
		this.element = element;
	}
	
	T getElement()
	{
		return element;
	}
	
	abstract String getData();
	abstract void sendData();
}









