Rails.application.routes.draw do
  root 'articles#index'
  get '/register', to: 'users#new'
  get '/settings', to: 'users#edit'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  resources :articles
  resources :users
end
