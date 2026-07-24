package com.smart_parking.controller;


import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ParkingService parkingService;

    public ReservationController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping
    public List<ReservationResponse> getMine(@RequestParam String employeeId) {
        return parkingService.getReservationsForEmployee(employeeId);
    }

    @GetMapping("/admin")
    public List<ReservationResponse> getAll() {
        return parkingService.getAllReservations();
    }

    @PostMapping
    public ReservationResponse create(@Valid @RequestBody ReservationRequest request) {
        return parkingService.createReservation(request);
    }

    @PostMapping("/{id}/checkin")
    public ReservationResponse checkIn(@PathVariable Long id) {
        return parkingService.checkIn(id);
    }

    @PostMapping("/{id}/cancel")
    public ReservationResponse cancel(@PathVariable Long id) {
        return parkingService.cancel(id);
    }
}