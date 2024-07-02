package com.example.wealthManagement.controller;

import com.example.wealthManagement.entity.Asset;
import com.example.wealthManagement.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/assets")
public class AssetController {
    @Autowired
    private AssetService assetService;

    @GetMapping("/{username}")
    public List<Asset> getAssetsByUsername(@PathVariable String username) {
        return assetService.getAssetsByUsername(username);
    }
    
    @PostMapping("/{username}")
    public Asset addAsset(@RequestBody Asset asset) {
        return assetService.addAsset(asset);
    }
    
    @DeleteMapping("/delete/{username}")
    public void removeAsset(@RequestBody Asset asset, @PathVariable String username) {
    	assetService.removeAsset(asset, username);
    	return;
    }
}