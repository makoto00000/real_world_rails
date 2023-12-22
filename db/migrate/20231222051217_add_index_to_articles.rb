class AddIndexToArticles < ActiveRecord::Migration[7.0]
  def change
    add_index :articles, :slug
  end
end
