using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.API.Models
{
    public class Usercredentials : Model
    {
        [Required]
        [ForeignKey("FK_User_Id")]
        public int UserId { get; set; }
        [Required]
        public String Email { get; set; }
        [Required]
        public String Password { get; set; }
    }
}
