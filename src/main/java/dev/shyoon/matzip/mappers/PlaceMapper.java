package dev.shyoon.matzip.mappers;

import dev.shyoon.matzip.entities.PlaceEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlaceMapper {
    int insertPlace(PlaceEntity place);
}
