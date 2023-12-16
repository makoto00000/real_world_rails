Rails.application.routes.draw do
  root 'articles#index'
  get '/register', to: 'users#new'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  resources :articles
  resources :users
end
