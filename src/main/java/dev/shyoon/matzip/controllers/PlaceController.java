package dev.shyoon.matzip.controllers;

import dev.shyoon.matzip.entities.PlaceEntity;
import dev.shyoon.matzip.entities.UserEntity;
import dev.shyoon.matzip.services.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping(value = "/place")
public class PlaceController {
    private final PlaceService placeService;

    @Autowired
    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @RequestMapping(value = "/",
    method = RequestMethod.POST,
    produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(@SessionAttribute(value = "user")UserEntity user,
                            PlaceEntity place,
                            @RequestParam(value = "thumbnailMultipart")MultipartFile thumbnailMultipart)throws IOException {
//        @SessionAttribute 로그인 상태 (session에 저장된 데이터를 가져옴 로그인 안되어있으면 못가져옴)
        place.setThumbnail(thumbnailMultipart.getBytes())
                .setThumbnailMime(thumbnailMultipart.getContentType())
                .setRegisteredBy(user.getEmail()); //로그인한 사람의 이메일
        boolean result = this.placeService.putPlace(place);
        return String.valueOf(result);
    }
}
