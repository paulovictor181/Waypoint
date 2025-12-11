package br.edu.ufersa.waypoint.components.local.api.restControllers;


import br.edu.ufersa.waypoint.components.local.domain.service.LocalService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/location")
@RequiredArgsConstructor
public class LocalController {

    private final LocalService localService;

}