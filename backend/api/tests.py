from django.test import TestCase

# Create your tests here.
from api.consumer import CompilerConsumer
from channels.testing import WebsocketCommunicator

async def test():
    communicator = WebsocketCommunicator(CompilerConsumer.as_asgi(), "/ws/iostream")
    connected, subprotocol = await communicator.connect()
    assert connected
    # Test sending text
    await communicator.send_to(text_data="hello")
    response = await communicator.receive_from()
    assert response == "hello"
    # Close
    await communicator.disconnect()
    
if __name__=='__main__':
    test()