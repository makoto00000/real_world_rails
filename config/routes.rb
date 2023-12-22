Rails.application.routes.draw do
  root 'articles#index'
  get '/editor', to: 'articles#new'
  get '/register', to: 'users#new'
  get '/settings', to: 'users#edit'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  resources :articles, param: :slug, only: [:edit, :update, :show, :destroy]
  resources :articles, only: [:index, :new, :create]
  resources :users
end
