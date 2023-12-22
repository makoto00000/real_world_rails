require "test_helper"

class ArticlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
    assert_response :success
    assert_template 'index'
  end

  test "should get show" do
    article = Article.first
    get article_path(article.slug)
    assert_response :success
  end
end
