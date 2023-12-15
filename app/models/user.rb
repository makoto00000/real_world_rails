class User < ApplicationRecord
  attr_accessor :password

  has_many :articles
  before_save :hash_password

  validates :name,
            presence: true,
            length: { maximum: 50 }

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  validates :email,
            presence: true,
            length: { maximum: 255 },
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: true

  validates :password,
            presence: true,
            length: { minimum: 6 }

  def self.digest(string)
    cost = BCrypt::Engine::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  def authenticated?(password)
    BCrypt::Password.new(encrypted_password) == password
  end

  private

  def downcase_email
    email.downcase!
  end

  def hash_password
    self.encrypted_password = BCrypt::Password.create(password)
  end

end
