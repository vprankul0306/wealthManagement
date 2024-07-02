package com.example.wealthManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.wealthManagement.entity.Stock;
import com.example.wealthManagement.repository.StockRepository;

import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    public List<Stock> getUserStocks(String username) {
        return stockRepository.findByUsername(username);
    }

    public Stock addStock(String username, Stock stock) {
    	stock.setUsername(username);
        return stockRepository.save(stock);
    }

	public void removeStock(String username, String symbol) {
		stockRepository.deleteByUsernameAndSymbol(username, symbol);	
	}
}
