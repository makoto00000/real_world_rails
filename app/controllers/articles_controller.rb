class ArticlesController < ApplicationController
  def index
    # @articles = Article.all
    @articles = Article.paginate(page: params[:page])
    @tags = Tag.all
  end

  def new
    @article = Article.new
    @article.tags.build
  end

  def create # rubocop:disable Metrics/MethodLength
    @article = current_user.articles.build(article_params)
    unless @article.tags.blank?
      tags = []
      @article.tags.each do |tag|
        tags << Tag.find_or_create_by(name: tag.name)
      end
      @article.tags = tags
    end

    if @article.save
      redirect_to @article
    else
      render 'articles/new', status: :unprocessable_entity
    end
  end

  def edit
    @article = Article.find(params[:id])
  end

  def update # rubocop:disable Metrics/MethodLength
    @article = Article.find(params[:id])
    @article.tags = []
    @article.assign_attributes(article_params)
    unless @article.tags.blank?
      @article.tags = @article.tags.map do |tag|
        Tag.find_or_create_by(name: tag.name)
      end
    end
    if @article.save
      redirect_to @article
    else
      render 'edit', status: :unprocessable_entity
    end
  end

  def show
    @article = Article.find(params[:id])
  end

  private
    def article_params
      params.require(:article).permit(:title, :description, :body, tags_attributes:[:name, :_destroy])
    end
end
