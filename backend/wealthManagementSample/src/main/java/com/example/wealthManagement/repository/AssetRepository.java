package com.example.wealthManagement.repository;

import com.example.wealthManagement.entity.Asset;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {
    List<Asset> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("DELETE FROM Asset a WHERE a.username = :username AND a.name = :assetNameString")
	void deleteByNameAndUsername(@Param("assetNameString") String assetNameString, @Param("username") String username);

}