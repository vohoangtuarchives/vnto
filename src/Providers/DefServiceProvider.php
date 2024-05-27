<?php

namespace Def\Providers;

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

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->alias(UserRepository::class, UserRepositoryContract::class);
    }
}
