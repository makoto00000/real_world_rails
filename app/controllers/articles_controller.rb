class ArticlesController < ApplicationController
  def index
    # @articles = Article.all
    @articles = Article.paginate(page: params[:page])
    @tags = Tag.all
  end

  def new
  end

  def create
    @article = current_user.article.build(article_params)
    if @article.save
      redirect_to root_path
    else
      render 'articles/new'
    end
  end

  def edit
  end

  def show
    @article = Article.find(params[:id])
  end

  private
    def article_params
      params.require(:article).permit(:title, :description, :body, :tags)
    end
end
