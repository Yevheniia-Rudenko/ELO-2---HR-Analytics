using System.ComponentModel.DataAnnotations;

namespace backend.API.Models
{
    public class UserType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public String Description { get; set; }
    }
}
