class Article < ApplicationRecord
  belongs_to :user
  has_many :article_tags
  has_many :tags, through: :article_tags
  accepts_nested_attributes_for :article_tags

  def formatted_created_at
    created_at.strftime("%B %dth")
  end
end
