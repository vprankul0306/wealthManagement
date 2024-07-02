package com.example.wealthManagement.entity;

import jakarta.persistence.*;

@Entity
public class Asset {
    @Id
    private String name;
    private double value;
    private String username;


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}