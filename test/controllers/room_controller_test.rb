require 'test_helper'

class RoomControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get room_index_url
    assert_response :success
  end

end
