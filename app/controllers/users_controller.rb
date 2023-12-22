class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def show
    @user = User.find(params[:id])
    # @articles = Article.paginate(page: params[:page])
    @articles = @user.articles.paginate(page: params[:page], per_page: 5)
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      redirect_to root_url
    else
      render 'new', status: :unprocessable_entity
    end
  end

  def edit
    @user = User.find(params[:id])
    redirect_to root_url unless current_user == @user
  end

  def update
    @user = User.find(params[:id])
    if @user.update(edit_params)
      redirect_to @user
    else
      render 'edit', status: :unprocessable_entity
    end
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password)
    end

    def edit_params
      params.require(:user).permit(:image_url, :name, :bio, :email, :password)
    end
end
