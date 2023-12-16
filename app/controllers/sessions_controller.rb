class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user&.authenticated?(params[:session][:password])
      reset_session
      log_in @user
      redirect_to root_url
    else
      flash.now[:warning] = "Invalid email/password combination"
      render 'new', status: :unprocessable_entity
    end
  end

end
