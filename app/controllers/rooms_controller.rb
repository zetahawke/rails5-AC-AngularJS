class RoomsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_room, only: [:show, :update, :destroy]
  def index
    @room = Room.new
    @rooms = Room.all
  end

  def show
    @message = Message.new
  end

  def create
    room = Room.new(topic: room_params[:topic], user_id: current_user.id)
    room.save
    if room.persisted?
      redirect_to room_path(room)
    else
      redirect_to rooms_path
    end
    
  end

  private

  def set_room
    unless params[:id].nil?
      @room = Room.find_by(id: params[:id])
    end
  end

  def room_params
    params.require(:room).permit(:topic)
  end
end
