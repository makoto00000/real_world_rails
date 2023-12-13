# frozen_string_literal: true

require 'faker'

%w[
  realworld
  implementations
  programming
  javascript
  emberjs
  angularjs
  react
  mean
  node
  rails
].each do |tag|
  Tag.create(name: tag)
end

10.times do
  User.new(
    name: Faker::Internet.unique.username(separators: []),
    email: Faker::Internet.email,
    encrypted_password: 'password',
    image_url: Faker::LoremFlickr.image
  ) do |user|
    user.save!
    20.times do
      user.articles.build(
        slug: Faker::Internet.slug,
        title: Faker::Lorem.sentence,
        description: Faker::Lorem.sentence,
        body: Faker::Lorem.paragraph(sentence_count: 10),
      ) do |article|
        article.save!
        article.tags << Tag.offset(rand(Tag.count)).first
        # article.tags = Tag.find(rand(1..10))
      end
    end
  end
end