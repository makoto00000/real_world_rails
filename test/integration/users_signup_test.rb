require "test_helper"

class UsesSignup < ActionDispatch::IntegrationTest

  test "invalid signup information" do
    assert_no_difference "User.count" do
      post users_path, params: { user: { name: "", email: "user@invalid", password: "123" } }
    end
    assert_response :unprocessable_entity
    assert_template 'users/new'
    assert_select 'ul.error-messages'
  end
  
  test "valid signup information" do
    assert_difference 'User.count', 1 do
      post users_path, params: { user: { name: "Example User", email: "user@valid.com", password: "password" } }
    end
    assert_response 302
    follow_redirect!
    assert_template 'index'
    assert is_logged_in?
  end
end
