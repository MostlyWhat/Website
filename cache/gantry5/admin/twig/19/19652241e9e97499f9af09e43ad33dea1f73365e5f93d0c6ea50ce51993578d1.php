<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @gantry-admin/partials/ajax.html.twig */
class __TwigTemplate_143ff85a5848f5137bd60e457be0c7eb1a8d281797050ebd784ed15cf6d9332f extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
            'content' => [$this, 'block_content'],
            'gantry_content_wrapper' => [$this, 'block_gantry_content_wrapper'],
            'gantry' => [$this, 'block_gantry'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        $this->displayBlock('content', $context, $blocks);
    }

    public function block_content($context, array $blocks = [])
    {
        // line 2
        $this->displayBlock('gantry_content_wrapper', $context, $blocks);
    }

    public function block_gantry_content_wrapper($context, array $blocks = [])
    {
        // line 3
        echo "    ";
        if (($context["navbar"] ?? null)) {
            // line 4
            echo "    <div data-g5-content-wrapper=\"\">
        ";
            // line 5
            $this->loadTemplate("@gantry-admin/partials/navigation.html.twig", "@gantry-admin/partials/ajax.html.twig", 5)->display($context);
            // line 6
            echo "        <div class=\"g-grid\">
            <div class=\"g-block main-block\">
                <section id=\"g-main\">
                    <div class=\"g-content\" data-g5-content=\"\">
                        ";
            // line 10
            $this->displayBlock('gantry', $context, $blocks);
            // line 12
            echo "                    </div>
                </section>
            </div>
        </div>
    </div>
    ";
        } else {
            // line 18
            echo "        ";
            $this->displayBlock("gantry", $context, $blocks);
            echo "
    ";
        }
    }

    // line 10
    public function block_gantry($context, array $blocks = [])
    {
        // line 11
        echo "                        ";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/partials/ajax.html.twig";
    }

    public function getDebugInfo()
    {
        return array (  80 => 11,  77 => 10,  69 => 18,  61 => 12,  59 => 10,  53 => 6,  51 => 5,  48 => 4,  45 => 3,  39 => 2,  33 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/partials/ajax.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\partials\\ajax.html.twig");
    }
}
