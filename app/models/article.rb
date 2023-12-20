class Article < ApplicationRecord
  belongs_to :user
  has_many :article_tags, dependent: :destroy
  has_many :tags, through: :article_tags
  accepts_nested_attributes_for :article_tags, allow_destroy: true
  accepts_nested_attributes_for :tags, allow_destroy: true

  validates :title, presence: true
  validates :description, presence: true
  validates :body, presence: true

  def formatted_created_at
    created_at.strftime("%B %dth")
  end


end
