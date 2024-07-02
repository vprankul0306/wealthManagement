package com.example.wealthManagement.service;

import com.example.wealthManagement.entity.Asset;
import com.example.wealthManagement.repository.AssetRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AssetService {
    @Autowired
    private AssetRepository assetRepository;

    public List<Asset> getAssetsByUsername(String username) {
        return assetRepository.findByUsername(username);
    }

    public double calculateTotalAssets(String username) {
        List<Asset> assets = getAssetsByUsername(username);
        return assets.stream().mapToDouble(Asset::getValue).sum();
    }
    
    public Asset addAsset(Asset asset) {
        return assetRepository.save(asset);
    }

	public void removeAsset(Asset asset, String username) {
		String assetNameString = asset.getName();
	    assetRepository.deleteByNameAndUsername(assetNameString, username);
	    return;
	}
}