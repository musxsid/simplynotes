package com.siddharth.simplynotes.repository;

import com.siddharth.simplynotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // find user by username (used in login)
    Optional<User> findByUsername(String username);
}