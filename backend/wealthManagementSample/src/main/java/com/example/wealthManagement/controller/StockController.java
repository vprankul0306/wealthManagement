package com.example.wealthManagement.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.wealthManagement.entity.Stock;
import com.example.wealthManagement.service.StockService;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/{username}")
    public List<Stock> getUserStocks(@PathVariable String username) {
        return stockService.getUserStocks(username);
    }


    @PostMapping("/{username}")
    public Stock addStock(@PathVariable String username, @RequestBody Stock stock) {
        return stockService.addStock(username, stock);
    }
    
    @DeleteMapping("/remove/{username}")
    public ResponseEntity<Void> removeStock(@PathVariable String username, @RequestBody String symbol)  {
    	JSONObject jsonObject = new JSONObject(symbol);
    	String stockSymbol = jsonObject.getString("symbol");
    	stockService.removeStock(username,stockSymbol);
    	return ResponseEntity.noContent().build();
    }
}
