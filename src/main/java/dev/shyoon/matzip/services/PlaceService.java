package dev.shyoon.matzip.services;

import dev.shyoon.matzip.entities.PlaceEntity;
import dev.shyoon.matzip.mappers.PlaceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PlaceService {
    private final PlaceMapper placeMapper;

    @Autowired
    public PlaceService(PlaceMapper placeMapper) {
        this.placeMapper = placeMapper;
    }

    public boolean putPlace(PlaceEntity place){
        place.setRegisteredAt(new Date())
                .setDeleted(false);
        return this.placeMapper.insertPlace(place)>0;
    }
}
