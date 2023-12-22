class ArticlesController < ApplicationController
  def index
    @articles = Article.paginate(page: params[:page])
    @tags = Tag.all
  end

  def new
    @article = Article.new
    @article.tags.build
    @user = current_user
    redirect_to root_url unless logged_in?
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
      redirect_to article_path(@article.slug)
    else
      render 'articles/new', status: :unprocessable_entity
    end
  end

  def edit
    @article = Article.find_by(slug: params[:slug])
    redirect_to root_url unless logged_in?
  end

  def update # rubocop:disable Metrics/MethodLength
    @article = Article.find_by(id: params[:slug])
    @article.tags = []
    @article.assign_attributes(article_params)
    unless @article.tags.blank?
      @article.tags = @article.tags.map do |tag|
        Tag.find_or_create_by(name: tag.name)
      end
    end
    if @article.save
      redirect_to article_path(@article.slug)
    else
      render 'edit', status: :unprocessable_entity
    end
  end

  def show
    @article = Article.find_by(slug: params[:slug])
  end

  def destroy
    Article.find_by(slug: params[:slug]).destroy
    redirect_to root_url, status: :see_other
  end

  private
    def article_params
      params.require(:article).permit(:title, :description, :body, tags_attributes:[:name, :_destroy])
    end
end
