require "test_helper"

class ArticlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
    assert_response :success
  end

  test "should get show" do
    @article = Article.first
    get @article
    assert_response :success
  end
end
