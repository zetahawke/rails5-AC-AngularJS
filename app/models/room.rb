class Room < ApplicationRecord
  has_many :messages, dependent: :destroy
  belongs_to :user
  has_many :users, through: :messages
  validates :topic, presence: true, uniqueness: true, case_sensitive: false
end
