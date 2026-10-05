using System.ComponentModel;
using ModelContextProtocol.Server;
using simpli.Application.Services;
using simpli.Domain.Dtos;

namespace simpli.Api.Mcp
{
    [McpServerToolType]
    public class RoomTools
    {
        private readonly IServiceProvider _provider;

        public RoomTools(IServiceProvider provider)
        {
            _provider = provider;
        }
        [McpServerTool(Name="get_all_room"),Description("returns a list of all rooms")]
        public async Task<List<RoomDto>> GetAllRoomsMcp([Description("This is company id")] int id)
        {
            await using var scope = _provider.CreateAsyncScope();
            var service = scope.ServiceProvider.GetRequiredService<RoomServices>();
            var query = new QueryParameters();
            var rooms =await service.GetAllRooms(id, query);
            return rooms;
        }
    }
}