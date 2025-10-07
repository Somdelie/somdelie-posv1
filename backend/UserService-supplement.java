package com.somdelie_pos.somdelie_pos.Service;

import com.somdelie_pos.somdelie_pos.modal.User;
import java.util.UUID;

/**
 * Supplement interface hints for methods referenced in updated backend examples.
 * Ensure your concrete implementation (e.g., UserServiceImpl) implements these.
 */
public interface UserServiceSupplement {
    User save(User user);
    User findById(UUID id);
}
