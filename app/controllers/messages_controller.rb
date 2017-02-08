class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_message, only: [:show, :update, :destroy]
  def index
  end

  def show
  end

  def create
    message = Message.new(content: message_params[:content], user_id: current_user.id, room_id: params[:room_id])
    message.save
    if message.persisted?
      ActionCable.server.broadcast 'messages',
        message
      head :ok
    else
      redirect_to rooms_path
    end
  end

  def delete
  end

  private
  def set_message
    unless params[:id].nil?
      @message = Message.find_by(id: params[:id])
    end
  end

  def message_params
    params.require(:message).permit(:content, :room_id)
  end
end
