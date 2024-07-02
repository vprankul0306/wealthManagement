package com.example.wealthManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.wealthManagement.entity.Stock;

import jakarta.transaction.Transactional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByUsername(String username);

    
    @Modifying
    @Transactional
    @Query("DELETE FROM Stock s WHERE s.username = :username AND s.symbol = :symbol")
    void deleteByUsernameAndSymbol(@Param("username") String username,@Param("symbol") String symbol);
}
