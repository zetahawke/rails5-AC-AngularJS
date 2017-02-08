class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable, :trackable
  attr_accessor :skip_password_validation

  has_many :messages
  has_many :chatrooms, through: :messages
  validates :username, presence: true, uniqueness: true

  def email_required?
    false
  end

  def email_changed?
    false
  end

  protected

  def password_required?
    return false if skip_password_validation
    super
  end
end
