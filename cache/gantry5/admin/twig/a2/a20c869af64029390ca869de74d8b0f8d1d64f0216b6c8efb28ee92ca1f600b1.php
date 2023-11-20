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

/* forms/fields/separator/note.html.twig */
class __TwigTemplate_d58c9ba24eb5ba7b61a8ce9c664dfad319676ce2f78e77f41b0472ccf6b2947e extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'field' => [$this, 'block_field'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"), "forms/fields/separator/note.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_field($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context["enabled"] = true;
        // line 5
        echo "    ";
        if ($this->getAttribute(($context["field"] ?? null), "condition", [])) {
            // line 6
            echo "        ";
            $context["enabled"] = ((($this->getAttribute(($context["field"] ?? null), "condition", []) == "override") && ($context["overrideable"] ?? null)) && ((($this->getAttribute(($context["field"] ?? null), "overridable", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "overridable", [])))) ? ($this->getAttribute(($context["field"] ?? null), "overridable", [])) : (((($this->getAttribute(($context["field"] ?? null), "overrideable", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "overrideable", [])))) ? ($this->getAttribute(($context["field"] ?? null), "overrideable", [])) : (true)))));
            // line 7
            echo "    ";
        }
        // line 8
        echo "
    ";
        // line 9
        if (($context["enabled"] ?? null)) {
            // line 10
            echo "    <div class=\"";
            echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "class", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "class", []), "alert alert-warning")) : ("alert alert-warning")), "html", null, true);
            echo "\">";
            echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter($this->getAttribute(($context["field"] ?? null), "content", []));
            echo "</div>
    ";
        }
    }

    public function getTemplateName()
    {
        return "forms/fields/separator/note.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  58 => 10,  56 => 9,  53 => 8,  50 => 7,  47 => 6,  44 => 5,  41 => 4,  38 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/separator/note.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\separator\\note.html.twig");
    }
}
