class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :bio
      t.string :encrypted_password, null: false
      t.string :image_url

      t.timestamps
    end
  end
end
