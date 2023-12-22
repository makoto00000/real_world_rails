require "test_helper"

class UsersLogin < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end
end

class InvalidPasswordTest < UsersLogin
  test "login with valid email / invalid password" do
    post login_path, params: { session: { email: @user.email, password: 'invalid' } }
    assert_not is_logged_in?
    assert_response :unprocessable_entity
    assert_template 'sessions/new'
    assert_not flash.empty?
    get root_path
    assert flash.empty?
  end
end

class ValidLogin < UsersLogin
  def setup
    super
    post login_path, params: { session: { email: @user.email, password: 'password'} }
  end
end

class ValidLoginTest < ValidLogin
  test "valid login" do
    assert is_logged_in?
  end
end

class LogoutTest < ValidLogin
  test "logout" do
    delete logout_path
    assert_not is_logged_in?
    assert_response :see_other
    follow_redirect!
    assert_template 'index'
  end
end
