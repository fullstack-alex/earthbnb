using Microsoft.AspNetCore.Mvc;
using Server.Services;

public class MyInitializer : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        // We have to implement this method too, because it is in the interface

        return Task.CompletedTask;
    }
}