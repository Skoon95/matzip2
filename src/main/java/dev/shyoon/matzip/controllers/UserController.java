package dev.shyoon.matzip.controllers;

import dev.shyoon.matzip.entities.RegisterContactCodeEntity;
import dev.shyoon.matzip.enums.SendRegisterContactCodeResult;
import dev.shyoon.matzip.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "contactCode",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactCode(RegisterContactCodeEntity registerContactCode) {
        SendRegisterContactCodeResult result = this.userService.sendRegisterContactCode(registerContactCode);
        JSONObject responseObject = new JSONObject() {{
           put("result",result.name().toLowerCase());
        }};
        if (result == SendRegisterContactCodeResult.SUCCESS) {
            responseObject.put("salt",registerContactCode.getSalt());
        }
        return responseObject.toString();
    }
}
