<?php

namespace Def\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Symfony\Component\Process\Exception\ProcessFailedException;

class Install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->check();
        $this->buildFiles();
    }

    private function check()
    {

    }

    private function buildFiles()
    {
        $this->buildFrontend();

    }

    private function buildFrontend()
    {
        $file = public_path("index.html");
        if (File::exists($file)) {
            File::delete($file);
        }

        $manifest = json_decode(file_get_contents(public_path("build/manifest.json")), true);


       $content = View::file(__DIR__ . "/stubs/index.blade.php")->with([
           'script' => $manifest['resources/js/app.js']['file'],
           'style' => $manifest['resources/js/app.js']['css'][0],
       ])->render();

       file_put_contents($file, $content);
    }


}
