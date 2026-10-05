using simpli.Application.Dtos;
using simpli.Application.Interfaces;

namespace simpli.Application.Services
{
    public class SystemEmailService
    {
        private readonly ISystemEmailsRepo _repo;
        private CompanyMappers _mapper;

        public SystemEmailService(ISystemEmailsRepo repo, CompanyMappers mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        public async Task<List<GetSystemEmailDto>> GetAll(GeneralQuery query, int CompanyId)
        {
            var emails = await _repo.GetAll(query, CompanyId);
            if (emails == null) return null;
            return emails.Select(x => _mapper.MapToDtoFromGetEmail(x)).ToList();
        }
        public async Task<GetSystemEmailDto> Get(string VisitorFullName, int CompanyId)
        {
            var user = await _repo.GetVisitorDetailsFromEmail(VisitorFullName, CompanyId);
            if (user == null) return null;
            return _mapper.MapToDtoFromGetEmail(user);
        }
        public async Task<GetSystemEmailDto> Post(PostSystemEmailDto emailDto, int CompanyId, int RoomId)
        {

            var entitity = _mapper.MapToEntityFromEmail(emailDto);
            var email = await _repo.Post(entitity, CompanyId, RoomId);
            return _mapper.MapToDtoFromGetEmail(email);
        }

    }
}