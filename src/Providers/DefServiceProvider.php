<?php

namespace Def\Providers;

use Def\Commands\Install;
use Def\Repository\Auth\AuthRepositoryContract;
use Def\Repository\Auth\AuthRepository;
use Def\Repository\User\UserRepository;
use Def\Repository\User\UserRepositoryContract;
use Illuminate\Support\ServiceProvider;

class DefServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->commands(
            [
                Install::class
            ]
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->alias(UserRepository::class, UserRepositoryContract::class);
        $this->app->alias(AuthRepository::class, AuthRepositoryContract::class);

    }
}
