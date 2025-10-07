package com.somdelie_pos.somdelie_pos.Service.impl;

import com.somdelie_pos.somdelie_pos.Service.StoreService;
import com.somdelie_pos.somdelie_pos.Service.UserService;
import com.somdelie_pos.somdelie_pos.domain.StoreStatus;
import com.somdelie_pos.somdelie_pos.domain.UserRole;
import com.somdelie_pos.somdelie_pos.exceptions.UserException;
import com.somdelie_pos.somdelie_pos.mapper.StoreMapper;
import com.somdelie_pos.somdelie_pos.modal.Store;
import com.somdelie_pos.somdelie_pos.modal.StoreContact;
import com.somdelie_pos.somdelie_pos.modal.User;
import com.somdelie_pos.somdelie_pos.payload.dto.StoreDto;
import com.somdelie_pos.somdelie_pos.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public StoreDto createStore(StoreDto storeDto, User user) {
        if (user.getStore() != null) {
            throw new RuntimeException("User already has a store");
        }
        Store store = StoreMapper.toEntity(storeDto, user);
        store = storeRepository.save(store);

        // link back
        user.setStore(store);
        if (user.getRole() == UserRole.ROLE_USER) {
            user.setRole(UserRole.ROLE_STORE_ADMIN);
        }
        userService.save(user);
        return StoreMapper.toDto(store);
    }

    @Override
    public StoreDto getStoreById(UUID id) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("Store with id: " + id + " not found")
        );
        return StoreMapper.toDto(store);
    }

    @Override
    public List<StoreDto> getAllStores() {
        List<Store> stores = storeRepository.findAll();
        return stores.stream().map(StoreMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public Store getStoreByAdmin() throws UserException {
        User admin = userService.getCurrentUser();
        return storeRepository.findByStoreAdmin(admin);
    }

    @Override
    public StoreDto updateStore(UUID id, StoreDto storeDto) throws UserException {
        User currentUser = userService.getCurrentUser();
        Store existingStore = storeRepository.findByStoreAdmin(currentUser);
        if (existingStore == null) {
            throw new UserException("Store with id: " + id + " not found");
        }
        existingStore.setBrandName(storeDto.getBrandName());
        existingStore.setDescription(storeDto.getDescription());
        if (storeDto.getStoreType() != null) existingStore.setStoreType(storeDto.getStoreType());
        if (storeDto.getContact() != null) {
            StoreContact contact = StoreContact.builder()
                    .address(storeDto.getContact().getAddress())
                    .phone(storeDto.getContact().getPhone())
                    .email(storeDto.getContact().getEmail())
                    .build();
            existingStore.setContact(contact);
        }
        Store updatedStore = storeRepository.save(existingStore);
        return StoreMapper.toDto(updatedStore);
    }

    @Override
    public void deleteStore(UUID id) throws UserException {
        Store store = getStoreByAdmin();
        storeRepository.delete(store);
    }

    @Override
    public StoreDto getStoreByEmployee() throws UserException {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new UserException("Oops! you don't have permission to access this store!");
        }
        return StoreMapper.toDto(currentUser.getStore());
    }

    @Override
    public StoreDto moderateStore(UUID id, StoreStatus status) throws UserException {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new UserException("Store with id: " + id + " not found")
        );
        store.setStatus(status);
        Store updatedStore = storeRepository.save(store);
        return StoreMapper.toDto(updatedStore);
    }
}
