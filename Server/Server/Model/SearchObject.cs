namespace Server.Model;

public class SearchObject
{
    public string destination { get; set; }
    public DateTime from { get; set; }
    public DateTime to { get; set; }
    public int guestsCount { get; set; }
    public int page { get; set; }
}